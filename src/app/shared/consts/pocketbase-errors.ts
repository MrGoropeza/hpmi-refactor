export const PocketBaseErrors = {
  list: {
    400: 'Petición inválida al servidor.',
    403: 'No estás autorizado.',
    404: 'La colección no existe.',
  },
  get: {
    400: 'Petición inválida al servidor.',
    403: 'No estás autorizado.',
    404: 'El registro no existe.',
  },
  create: {
    400: 'Petición inválida al servidor.',
    403: 'No estás autorizado.',
    404: 'La colección de registros de este tipo no existe.',
  },
  update: {
    400: 'Petición inválida al servidor.',
    403: 'No estás autorizado.',
    404: 'La colección de registros de este tipo no existe.',
  },
  delete: {
    400: 'El registro no se puede borrar ya que está relacionado con otro/s registro/s.',
    403: 'No estás autorizado.',
    404: 'El registro no existe.',
  },
};
