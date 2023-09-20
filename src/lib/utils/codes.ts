/* eslint-disable @typescript-eslint/no-explicit-any */
export const config = {
  input: {
    label: 'Código',
    length: {
      min: 24,
      max: 30
    }
  },

  sanitization: {
    convert: {
      lowercase: true
    },
    remove: {
      regex: true
    }
  },
  validation: {
    regex: {
      main: true
    }
  },

  alert: [
    { code: 0, type: '', alert: '' },
    { code: 1, type: 'error', alert: ():string => { return `${config.input.label} deve conter somente letras minúsculas, maiúsculas e o símbolo: "_" (underline).` } },
    { code: 2, type: 'error', alert: ():string => { return `${config.input.label} deve conter no mínimo ${config.input.length.min} caracteres.` } },
    { code: 3, type: 'error', alert: ():string => { return `${config.input.label} pode conter no máximo ${config.input.length.max} caracteres.` } }
  ]
}

export let errors = [] as any

export const error = {
  alert (params: any) {
    return errors[0].alert(params)
  }
}

export let output:string

export const sanitize = async (code:string) => {
  if (!code) return ''

  // Remove by regex
  code = code.replace(/[^a-zA-Z0-9_]/g, '')

  // Set output
  output = code

  return output
}
export const validate = async (username:string):Promise<boolean> => {
  errors = []

  if (config.validation.regex.main && !/^[a-zA-Z0-9_]*$/.test(username)) {
    errors.push(config.alert[1])
    return false
  }
  // Check if length is < config.input.length.min
  if (username.length < config.input.length.min) {
    errors.push(config.alert[2])
    return false
  }
  // Check if length is > config.input.length.max
  if (username.length > config.input.length.max) {
    errors.push(config.alert[3])
    return false
  }

  return true
}
