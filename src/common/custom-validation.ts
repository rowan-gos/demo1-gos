/* eslint-disable */

import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  MinLength,
  registerDecorator,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { isNullOrUndefined } from './utils';

// Type for UUID version
type UUIDVersion = '3' | '4' | '5' | 'all';

// Simple message type without i18n
type SimpleMessage = string;

type ValidationEnumOptions<E, T> = {
  enum: E;
  required?: boolean;
  default?: T;
  message?: SimpleMessage;
};

export function IsValidEnum<E extends object, T>(
  opts: ValidationEnumOptions<E, T>,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const { required = true, message = `${String(propertyKey)} is invalid` } =
      opts;

    IsEnum(opts.enum, { message })(target, propertyKey);
    if (opts.default)
      Transform(({ value }) =>
        isNullOrUndefined(value) ? opts.default : value,
      )(target, propertyKey);

    if (required) IsNotEmpty({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Date is valid
 */
type ValidationDateOptions = {
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  message?: SimpleMessage;
};

export function IsValidDate(
  { required = true, maxDate, minDate, message }: ValidationDateOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    message = message || `${String(propertyKey)} is invalid`;

    Type(() => Date)(target, propertyKey);

    if (minDate) MinDate(minDate, { message })(target, propertyKey);

    if (maxDate) MaxDate(maxDate, { message })(target, propertyKey);

    if (required) IsDefined({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number is valid
 */
type ValidationNumberOptions = {
  required?: boolean;
  min?: number;
  max?: number;
  default?: number;
  message?: SimpleMessage;
};

export function IsValidNumber(
  {
    required = true,
    min,
    max,
    message,
    default: _default,
  }: ValidationNumberOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsNumber({}, { message })(target, propertyKey);

    Type(() => Number)(target, propertyKey);

    if (typeof min === 'number') Min(min, { message })(target, propertyKey);

    if (typeof max === 'number') Max(max, { message })(target, propertyKey);
    if (typeof _default === 'number')
      Transform(({ value }) => (isNullOrUndefined(value) ? _default : value))(
        target,
        propertyKey,
      );

    if (required) IsDefined({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate Number string is valid
 */
type ValidationNumberStringOptions = {
  required?: boolean;
  maxLength?: number;
  message?: SimpleMessage;
};

export function IsValidNumberString(
  { required = true, message, maxLength }: ValidationNumberStringOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsNumberString({}, { message })(target, propertyKey);

    if (maxLength) MaxLength(maxLength, { message })(target, propertyKey);

    if (required) IsDefined({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate text is valid
 */
type ValidationTextOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
  trim?: boolean;
  message?: SimpleMessage;
};

export function IsValidText(
  {
    minLength = 1,
    maxLength = 255,
    required = true,
    matches,
    trim = true,
    message,
  }: ValidationTextOptions = {
    required: true,
    minLength: 1,
    maxLength: 255,
    trim: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsString({ message })(target, propertyKey);

    MaxLength(maxLength, { message })(target, propertyKey);
    if (trim) {
      Transform(({ value }: { value: string }) => value?.trim())(
        target,
        propertyKey,
      );
    }

    if (matches) Matches(matches, { message })(target, propertyKey);
    if (required) {
      MinLength(minLength, { message })(target, propertyKey);

      IsNotEmpty({ message })(target, propertyKey);
    } else IsOptional({ message })(target, propertyKey);
  };
}

export const PHONE_REGEX = /^(?=(?:.*\d){10,}$)[+]?[-\s()0-9]+$/;

type ValidationPhoneNumberOptions = {
  required?: boolean;
  message?: SimpleMessage;
  trim?: boolean;
};

export function IsValidPhoneNumber({
  required = true,
  message,
  trim = true,
}: ValidationPhoneNumberOptions = {}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const errorMessage = message || `${String(propertyKey)} is invalid`;

    if (trim) {
      Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
      )(target, propertyKey);
    }

    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey as string,
      options: { message: errorMessage },
      validator: {
        validate(value: unknown) {
          if (isNullOrUndefined(value)) return !required;
          if (typeof value !== 'string') return false;

          const normalized = value.trim();
          if (!normalized) return !required;

          return PHONE_REGEX.test(normalized);
        },
      },
    });

    if (required) {
      IsNotEmpty({ message: errorMessage })(target, propertyKey);
    } else {
      IsOptional()(target, propertyKey);
    }
  };
}

/**
 * Validate uuid is valid
 */
type ValidationUUIDOptions = {
  required?: boolean;
  version?: UUIDVersion;
  message?: SimpleMessage;
};

export function IsValidUUID(
  { required = true, version = '4', message }: ValidationUUIDOptions = {
    required: true,
    version: '4',
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsUUID(version, { message })(target, propertyKey);

    if (required) IsNotEmpty({ message })(target, propertyKey);
    else IsOptional({ message })(target, propertyKey);
  };
}

/**
 * Validate object is valid
 */
type ValidationObjectOptions = {
  required?: boolean;
  object?: { new (...args: any[]): any };
  message?: SimpleMessage;
};

export function IsValidObject(
  { object, required = true, message }: ValidationObjectOptions = {
    required: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    ValidateNested()(target, propertyKey);

    if (typeof object === 'function') Type(() => object)(target, propertyKey);

    if (required) IsDefined({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Valid array of number
 */
type ValidationArrayOptions<T = any> = {
  required?: boolean;
  minSize?: number;
  maxSize?: number;
  unique?: boolean;
  minValue?: number;
  maxValue?: number;
  defaults?: T[];
  message?: SimpleMessage;
};

// Don't know why default value min/max size array not work here.
export function IsValidArrayNumber(
  {
    required = true,
    minSize,
    maxSize,
    unique,
    maxValue,
    minValue,
    message,
  }: ValidationArrayOptions = {
    required: true,
    unique: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsNumber({}, { each: true, message })(target, propertyKey);

    Transform(({ value }) =>
      Array.isArray(value)
        ? value.map(Number)
        : isNullOrUndefined(value)
          ? []
          : [Number(value)],
    )(target, propertyKey);
    if (typeof minSize === 'number')
      ArrayMinSize(minSize, { message })(target, propertyKey);
    if (typeof maxSize === 'number')
      ArrayMaxSize(maxSize, { message })(target, propertyKey);

    if (unique) ArrayUnique({ message })(target, propertyKey);
    if (typeof minValue === 'number')
      Min(minValue, { each: true, message })(target, propertyKey);
    if (typeof maxValue === 'number')
      Max(maxValue, { each: true, message })(target, propertyKey);

    if (required) IsDefined({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

export function IsValidArrayString(
  {
    required = true,
    minSize,
    maxSize,
    unique,
    message,
  }: ValidationArrayOptions = {
    required: true,
    unique: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsString({ each: true, message })(target, propertyKey);

    Transform(({ value }) =>
      Array.isArray(value) ? value : isNullOrUndefined(value) ? [] : [value],
    )(target, propertyKey);
    if (typeof minSize === 'number')
      ArrayMinSize(minSize, { message })(target, propertyKey);
    if (typeof maxSize === 'number')
      ArrayMaxSize(maxSize, { message })(target, propertyKey);

    if (unique) ArrayUnique({ message })(target, propertyKey);

    if (required) IsNotEmpty({ each: true, message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Validate array of object is valid
 */
export function IsValidArrayObject(
  {
    maxSize,
    minSize,
    required = true,
    message,
    defaults,
  }: ValidationArrayOptions,
  object: { new (...args: any[]): any },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsArray({ message })(target, propertyKey);

    ValidateNested({ each: true, message })(target, propertyKey);
    if (typeof minSize === 'number')
      ArrayMinSize(minSize, { message })(target, propertyKey);
    if (typeof maxSize === 'number')
      ArrayMaxSize(maxSize, { message })(target, propertyKey);
    if (Array.isArray(defaults)) {
      Transform(({ value }) =>
        Array.isArray(value)
          ? value
          : isNullOrUndefined(value)
            ? defaults
            : [value],
      )(target, propertyKey);
    } else {
      Transform(({ value }) =>
        Array.isArray(value) ? value : isNullOrUndefined(value) ? [] : [value],
      )(target, propertyKey);
    }

    Type(() => object)(target, propertyKey);

    if (required) IsNotEmpty({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

export function IsValidArrayEnum(
  {
    maxSize,
    minSize,
    unique,
    required = true,
    defaults,
    message,
  }: ValidationArrayOptions,
  enumObj: object,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsArray({ message })(target, propertyKey);
    IsEnum(enumObj, { each: true, message })(target, propertyKey);
    if (typeof minSize === 'number')
      ArrayMinSize(minSize, { message })(target, propertyKey);
    if (typeof maxSize === 'number')
      ArrayMaxSize(maxSize, { message })(target, propertyKey);

    if (unique) ArrayUnique()(target, propertyKey);
    if (Array.isArray(defaults)) {
      Transform(({ value }) =>
        Array.isArray(value) ? value : value ? [value] : defaults,
      )(target, propertyKey);
    } else {
      Transform(({ value }) =>
        Array.isArray(value) ? value : value ? [value] : [],
      )(target, propertyKey);
    }

    if (required) IsNotEmpty({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

/**
 * Match two field
 */
export function MatchField(
  property: string,
  validationOptions?: ValidationOptions & { message?: SimpleMessage },
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;

          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage() {
          const message =
            validationOptions?.message || `${String(propertyName)} is invalid`;
          return message;
        },
      },
    });
  };
}

/**
 * Require all field exist
 */
export function ExcludeAllField(
  property: string[],
  validationOptions?: ValidationOptions & { message?: SimpleMessage },
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (relatedValue) return false;
          }

          return true;
        },
        defaultMessage() {
          const message =
            validationOptions?.message || `${String(propertyName)} is invalid`;
          return message;
        },
      },
    });
  };
}

/**
 * Require all field exist
 */
export function RequireAllField(
  property: string[],
  validationOptions?: ValidationOptions & { message?: SimpleMessage },
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (!relatedValue) return false;
          }

          return true;
        },
        defaultMessage() {
          const message =
            validationOptions?.message || `${String(propertyName)} is invalid`;
          return message;
        },
      },
    });
  };
}

/**
 * Require one of fields exist
 */
export function IsRequireOneOf(
  property: string[],
  validationOptions?: ValidationOptions & { message?: SimpleMessage },
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;

          for (const keyField of constraints) {
            const relatedValue = (args.object as any)[keyField];
            if (relatedValue) return true;
          }

          return false;
        },

        defaultMessage() {
          const message =
            validationOptions?.message || `${String(propertyName)} is invalid`;
          return message;
        },
      },
    });
  };
}

/**
 * Validate only one field exists, if two field, or no filed exist, this will throw error
 * @param property Fields to check exists
 * @param validationOptions
 */
export function IsOnlyOneFieldExist(
  property: string[],
  validationOptions?: ValidationOptions & { message?: SimpleMessage },
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: property,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          let isExisted = false;

          for (const fieldKey of constraints) {
            const fieldValue = (args.object as any)[fieldKey];

            // Two field exists
            if (fieldValue && isExisted) return false;

            if (fieldValue) isExisted = true;
          }

          if ((args.object as any)[args.property] && isExisted) return false;

          return true;
        },

        defaultMessage(): string {
          const message =
            validationOptions?.message || `${String(propertyName)} is invalid`;
          return message;
        },
      },
    });
  };
}

type ValidationEnumStringOptions = {
  enum: Record<string, any>;
  required?: boolean;
  default?: string;
  message?: SimpleMessage;
};

type ValidationEnumNumberOptions = {
  enum: Record<string, any>;
  required?: boolean;
  default?: number;
  message?: SimpleMessage;
};

export function IsValidEnumNumber(
  opts: ValidationEnumNumberOptions,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const message = opts?.message || `${String(propertyKey)} is invalid`;

    IsEnum(opts.enum, { message })(target, propertyKey);

    if (opts.required) IsDefined({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
    if (opts.default)
      Transform(({ value }) => value || opts.default)(target, propertyKey);
  };
}

export function IsValidEnumString(
  opts: ValidationEnumStringOptions,
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const message = opts?.message || `${String(propertyKey)} is invalid`;

    if (opts.required) {
      IsDefined({ message })(target, propertyKey);

      IsEnum(opts.enum, { message })(target, propertyKey);
    } else IsOptional()(target, propertyKey);
  };
}

type ValidationBooleanOptions = {
  required?: boolean;
  default?: boolean;
  message?: SimpleMessage;
};

export function IsValidBoolean(
  { message, default: _default, required }: ValidationBooleanOptions = {
    required: true,
  },
) {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsBoolean({ message })(target, propertyKey);

    Transform(({ value }) =>
      value ? Boolean(value) : typeof _default === 'boolean' ? _default : value,
    )(target, propertyKey);

    if (required) IsDefined({ message })(target, propertyKey);
    else IsOptional()(target, propertyKey);
  };
}

type ValidationEmailOptions = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
  trim?: boolean;
  message?: SimpleMessage;
};

export function IsValidEmail(
  {
    minLength = 1,
    maxLength = 255,
    required = true,
    matches,
    trim = true,
    message,
  }: ValidationEmailOptions = {
    required: true,
    minLength: 1,
    maxLength: 255,
    trim: true,
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    message = message || `${String(propertyKey)} is invalid`;

    IsEmail()(target, propertyKey);

    MinLength(minLength, { message })(target, propertyKey);

    MaxLength(maxLength, { message })(target, propertyKey);
    if (trim) {
      Transform(({ value }: { value: string }) => value?.trim())(
        target,
        propertyKey,
      );
    }

    if (matches) Matches(matches, { message })(target, propertyKey);

    if (required) IsNotEmpty({ message })(target, propertyKey);
    else IsOptional({ message })(target, propertyKey);
  };
}
