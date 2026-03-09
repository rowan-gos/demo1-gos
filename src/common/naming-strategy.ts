import { UnderscoreNamingStrategy } from '@mikro-orm/core';

export class CustomNamingStrategy extends UnderscoreNamingStrategy {
  propertyToColumnName(propertyName: string): string {
    if (propertyName.includes('_')) {
      return propertyName;
    }
    return super.propertyToColumnName(propertyName);
  }

  classToTableName(entityName: string): string {
    return super.classToTableName(entityName);
  }

  joinTableName(
    sourceEntity: string,
    targetEntity: string,
    propertyName: string,
  ): string {
    return super.joinTableName(sourceEntity, targetEntity, propertyName);
  }
}
