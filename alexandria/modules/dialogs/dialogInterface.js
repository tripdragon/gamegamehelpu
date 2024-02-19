export class DialogInterface {

  constructor(props) {

    const {
      theme
    } = props;

    if (this.constructor === DialogInterface) {
      throw new Error('Can\'t instantiate interface directly');
    }

    // Props validation
    if (!theme) {
      throw new Error('Dialog must receive theme');
    }

    // Implementation validation
    if (
      typeof this.dismiss !== 'function'
      || typeof this.superDelete !== 'function'
    ) {
      throw new Error('Dialog must implement dismiss() and superDelete()');
    }

    this.theme = theme;

    return this;
  }
}
