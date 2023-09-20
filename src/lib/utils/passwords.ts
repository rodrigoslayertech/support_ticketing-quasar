/* eslint-disable @typescript-eslint/no-explicit-any */
export const config = {
  validation: {
    characteres: {
      number: true,
      uppercase: true,
      lowercase: true,
      symbol: false
    },
    strong: 4
  },
  alert: [
    { code: 0, alert: ():string => { return '' } },
    { code: 1, alert: ():string => { return 'Senha deve conter pelo menos 6 caracteres.' } },
    { code: 2, alert: ():string => { return 'Senha deve conter no máximo 64 caracteres.' } },
    { code: 3, alert: ():string => { return 'Senha deve conter pelo menos um número.' } },
    { code: 4, alert: ():string => { return 'Senha deve conter pelo menos uma letra maiúscula.' } },
    { code: 5, alert: ():string => { return 'Senha deve conter pelo menos uma letra minúscula.' } },
    { code: 6, alert: ():string => { return 'Senha deve conter pelo menos um símbolo.' } },
    { code: 7, alert: ():string => { return 'Sua senha precisa ser mais segura! Adicione mais caracteres ou um símbolo para aumentar a força da senha.' } } // TODO get password strength
  ]
}

export let errors = [] as any
export const error = {
  alert (params: never) {
    return errors[0].alert(params)
  }
}

export const meta = {
  strength: {
    level: 0,
    label: ''
  }
}

export const validate = async (password:string):Promise<boolean> => {
  errors = []

  meta.strength.level = 0
  meta.strength.label = '?'

  if (password.length < 6) {
    errors.push(config.alert[1])
    return false
  }
  if (password.length > 64) {
    errors.push(config.alert[2])
    return false
  }

  // Regex name to only allowed characters
  const number = /(.*[0-9].*)/g.test(password)
  const uppercase = /(.*[A-Z].*)/g.test(password)
  const lowercase = /(.*[a-z].*)/g.test(password)
  const symbol = /[^A-Za-z0-9]/g.test(password)

  const repeated = /(\w)(\1+\1+\1+\1+)/g.test(password)

  let mixed = 0
  if ((lowercase || uppercase) && number) {
    mixed = 1
  }
  if (uppercase && lowercase) {
    mixed++
  }

  let special = 0
  if ((lowercase || uppercase || number) && symbol) {
    special = 1
    mixed++
  }

  let long = 0
  if (password.length > 8) {
    long = 1
  }
  if (password.length > 12 && !repeated) {
    long = 2
  }
  if (password.length > 25 && !repeated) {
    long = 3
  }

  meta.strength.level = mixed + special + long
  if (meta.strength.level > 4) {
    meta.strength.level = 4
  }
  switch (meta.strength.level) {
    case 0:
      meta.strength.label = 'Extremamente fraca'; break
    case 1:
      meta.strength.label = 'Muito fraca'; break
    case 2:
      meta.strength.label = 'Fraca'; break
    case 3:
      meta.strength.label = 'Forte'; break
    case 4:
      meta.strength.label = 'Muito forte'; break
    default:
      meta.strength.label = '?'
  }

  if (config.validation.characteres.number && !number) {
    errors.push(config.alert[3])
    return false
  } else if (config.validation.characteres.uppercase && !uppercase) {
    errors.push(config.alert[4])
    return false
  } else if (config.validation.characteres.lowercase && !lowercase) {
    errors.push(config.alert[5])
    return false
  } else if (config.validation.characteres.symbol && !symbol) {
    errors.push(config.alert[6])
    return false
  } else if (meta.strength.level < config.validation.strong) {
    errors.push(config.alert[7])
    return false
  }

  return true
}
