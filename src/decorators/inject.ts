import Koa from 'koa'
import Validator, { ValidationRuleObject } from 'fastest-validator'
import { INJECT_KEY } from '../consts'

export type StrictValidationRuleName =
  | "any"
  | "array"
  | "boolean"
  | "class"
  | "custom"
  | "date"
  | "email"
  | "enum"
  | "equal"
  | "forbidden"
  | "function"
  | "luhn"
  | "mac"
  | "multi"
  | "number"
  | "object"
  | "string"
  | "url"
  | "uuid"

type StrictValidationSchema<T = any> = {
  /**
   * Object properties which are not specified on the schema are ignored by default.
   * If you set the $$strict option to true any additional properties will result in an strictObject error.
   * @default true
   */
  $$strict?: boolean | "remove";
} & {
    /**
     * List of validation rules for each defined field
     */
    [key in keyof T]: StrictValidationRuleName | ValidationRuleObject | ValidationRuleObject[];
  };


export function Inject(
  getter: (ctx: Koa.Context) => any
): MethodDecorator {
  return (target, key, descriptor) => {
    if (!descriptor.value[INJECT_KEY]) descriptor.value[INJECT_KEY] = []
    descriptor.value[INJECT_KEY].push(getter)
    return descriptor
  }
}

function InjectWithSchema<T>(key: string, schema?: StrictValidationSchema<T>) {
  const v = new Validator()
  const check = schema && v.compile<T>({
    $$strict: true,
    ...schema
  })
  return Inject((ctx: Koa.Context) => {
    const source = (ctx.request as any)[key]
    if (!check) return source
    const errors = check(source)
    if (Array.isArray(errors) && errors.length) {
      const messages = errors
        .map(
          (e) =>
            `${e.message.replace(/\.$/, '')}, actual: ${e.actual === '' ? `'${e.actual}'` : e.actual}.`
        )
        .join('\n')
      ctx.throw(400, messages)
    }
    return source
  })
}

export function Ctx() {
  return Inject((ctx) => ctx)
}

export function Body<T>(schema?: StrictValidationSchema<T>) {
  return InjectWithSchema<T>('body', schema)
}

export function Query<T>(schema?: StrictValidationSchema<T>) {
  return InjectWithSchema<T>('query', schema)
}

export function RequestFile() {
  return Inject(ctx => (ctx.request as any).files)
}

export function Session() {
  return Inject(ctx => (ctx as any).session)
}