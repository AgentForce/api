import { MetaType } from '../postgres';

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
                }
            });
            return types;
        } catch (error) {
            throw error;
        }
    }

}
export { MetatypeService };