import { Accountability, Action } from '@directus/shared/types';
import { uniq } from 'lodash';
import validateUUID from 'uuid-validate';
import env from '../env';
import { ForbiddenException } from '../exceptions/forbidden';
import logger from '../logger';
import { AbstractServiceOptions, Item, MutationOptions, PrimaryKey } from '../types';
import { getPermissions } from '../utils/get-permissions';
import { Url } from '../utils/url';
import { userName } from '../utils/user-name';
import { AuthorizationService } from './authorization';
import { ItemsService } from './items';
import { NotificationsService } from './notifications';
import { UsersService } from './users';

export class ActivityService extends ItemsService {
	notificationsService: NotificationsService;
	usersService: UsersService;

	constructor(options: AbstractServiceOptions) {
		super('directus_activity', options);
		this.notificationsService = new NotificationsService({ schema: this.schema });
		this.usersService = new UsersService({ schema: this.schema });
	}

	async createOne(data: Partial<Item>, opts?: MutationOptions): Promise<PrimaryKey> {
		if (data.action === Action.COMMENT && typeof data.comment === 'string') {
			const usersRegExp = new RegExp(/@[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/gi);

			const mentions = uniq(data.comment.match(usersRegExp) ?? []);

			const sender = await this.usersService.readOne(this.accountability!.user!, {
				fields: ['id', 'first_name', 'last_name', 'email'],
			});

			for (const mention of mentions) {
				const userID = mention.substring(1);

				const user = await this.usersService.readOne(userID, {
					fields: ['id', 'first_name', 'last_name', 'email', 'role.id', 'role.admin_access', 'role.app_access'],
				});

				const accountability: Accountability = {
					user: userID,
					role: user.role?.id ?? null,
					admin: user.role?.admin_access ?? null,
					app: user.role?.app_access ?? null,
				};

				accountability.permissions = await getPermissions(accountability, this.schema);

				const authorizationService = new AuthorizationService({ schema: this.schema, accountability });
				const usersService = new UsersService({ schema: this.schema, accountability });

				try {
					await authorizationService.checkAccess('read', data.collection, data.item);

					const templateData = await usersService.readByQuery({
						fields: ['id', 'first_name', 'last_name', 'email'],
						filter: { id: { _in: mentions.map((mention) => mention.substring(1)) } },
					});

					const userPreviews = templateData.reduce((acc, user) => {
						acc[user.id] = `<em>${userName(user)}</em>`;
						return acc;
					}, {} as Record<string, string>);

					let comment = data.comment;

					for (const mention of mentions) {
						const uuid = mention.substring(1);
						// We only match on UUIDs in the first place. This is just an extra sanity check
						if (validateUUID(uuid) === false) continue;
						comment = comment.replace(new RegExp(mention, 'gm'), userPreviews[uuid] ?? '@Unknown User');
					}

					comment = `> ${comment.replace(/\n+/gm, '\n> ')}`;

					const message = `
Hello ${userName(user)},

${userName(sender)} has mentioned you in a comment:

${comment}

<a href="${new Url(env.PUBLIC_URL)
						.addPath('admin', 'content', data.collection, data.item)
						.toString()}">Click here to view.</a>
`;

					let subject = `You were mentioned in ${data.collection}`;
					if (data.collection == 'loan_applications' && data.action == 'comment') {
						const loanApplicationItemsServiceInstance = new ItemsService('loan_applications', { schema: this.schema });
						const application = await loanApplicationItemsServiceInstance.readOne(data.item);
						subject = `You were mentioned in ${application.first_name} ${application.last_name}'s ${application.loan_category} Application`;
					}

					await this.notificationsService.createOne({
						recipient: userID,
						sender: sender.id,
						subject: subject,
						message,
						collection: data.collection,
						item: data.item,
					});
				} catch (err: any) {
					if (err instanceof ForbiddenException) {
						logger.warn(`User ${userID} doesn't have proper permissions to receive notification for this item.`);
					} else {
						throw err;
					}
				}
			}
		}

		return super.createOne(data, opts);
	}
}
