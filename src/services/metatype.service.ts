import { MetaType } from '../postgres';
interface IMetatype {
    Type: string;
    Key: number;
    Value: string;
    Description: string;
}
class MetatypeService {

    /**
     * list all event of userid
     * @param userId number
     */
    static async findByType(type) {
        try {
            let types = await MetaType.findAll({
                where: {
                    Type: type,
                    IsDeleted: false
                },
                attributes: {
                    exclude: ['Id', 'IsDeleted', 'UpdatedAt', 'CreatedAt']
                }
            });
            return types;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Api create type
     * @param metatype Imeta
     */
    static async create(metatype: IMetatype) {
        return MetaType.create(metatype)
            .catch(ex => {
                throw ex;
            });
    }
}



export { MetatypeService, IMetatype };