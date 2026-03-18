export class PrismaWhereBuilder {
  private where: any = {};
  in(field: string, values: any[]) {
    if (values && values.length > 0) {
      this.where[field] = { in: values };
    }
    return this;
  }
  contains(fields: string[], search: string) {
    if (search) {
      this.where.OR = fields.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      }));
    }
    return this;
  }

  equals(field: string, value: any) {
    if (value !== undefined && value !== null) {
      this.where[field] = value;
    }
    return this;
  }

  relation(relationName: string, relationFilter: any) {
    if (Object.keys(relationFilter).length > 0) {
      this.where[relationName] = {
        ...this.where[relationName],
        ...relationFilter,
      };
    }
    return this;
  }
  build() {
    return this.where;
  }
}