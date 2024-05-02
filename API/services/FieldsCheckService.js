class CheckService {
    static requireAll(fields, obj, exclude = []) {
        const defaultExcludeFields = ["id", "createdAt", "updatedAt"];
        const filteredFields = fields.filter(field => !defaultExcludeFields.includes(field) && !exclude.includes(field));
        filteredFields.forEach(field => {
            if (!(field in obj)) {
                throw `Field '${field}' is required`;
            }
        });
    }
    
    static requireOnlyOne(fields, obj) {
        let found = false;
        fields.forEach(field => {
            if (field in obj) {
                if (found) throw `Only one of the fields '${fields.join(', ')}' is allowed`;
                found = true;
            }
        });
        if (!found) throw `At least one of the fields '${fields.join(', ')}' is required`;
    }
    
    static requireAtLeastOne(fields, obj, exclude = []) {
        const defaultExcludeFields = ["id", "createdAt", "updatedAt"];
        const filteredFields = fields.filter(field => !defaultExcludeFields.includes(field) && !exclude.includes(field));
        if (!filteredFields.some(field => field in obj)) {
            throw `At least one of the fields '${filteredFields.join(', ')}' is required`;
        }
    }
    
    static requireNone(fields, obj, isAdmin = false) {
        const defaultBannedFields = ["id", "createdAt", "updatedAt"];
        fields.forEach(field => {
            if (((field in obj) && !isAdmin) || (field in defaultBannedFields)) {
                throw `Field '${field}' is not allowed`;
            }
        });
    }

    static isUnknown(fields, obj) {
        const defaultBannedFields = ["id", "createdAt", "updatedAt"];
        const required_fields = fields;
        const foreignField = Object.keys(obj).find(field => (!required_fields.includes(field) || defaultBannedFields.includes(field)));
      
        if (foreignField) {
            throw `Unknown field: ${foreignField}`;
        }
    }

    static requireOnly(fields, obj) {
        this.isUnknown(fields, obj);
        this.requireAll(fields, obj);
    }
}


export default CheckService;