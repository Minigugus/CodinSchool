export default class Role {
  constructor(nom, permissions) {
    this.nom = nom
    this.permissions = permissions
  }

  peut(...operations) {
    return operations.every(operation => this.permissions.includes(operation))
  }

  toString() {
    return this.nom
  }
}
