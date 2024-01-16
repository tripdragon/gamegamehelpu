export class DialogInterface {

  constructor(props) {

    const {
      theme,
      title,
      body
    } = props;

    if (this.constructor === DialogInterface) {
      throw new Error('Can\'t instantiate interface directly');
    }

    // Props validation
    if (!theme || !title || !body) {
      throw new Error('Dialog must receive theme, title, and body');
    }

    // Theme validation
    if (!theme.background) {
      throw new Error('Dialog theme must define background');
    }

    // Implementation validation
    if (typeof this.show !== 'function' || typeof this.hide !== 'function' || typeof this.ref !== 'function') {
      throw new Error('Dialog must implement show(), hide(), and ref()');
    }

    this.theme = theme;
    this.title = title;
    this.body = body;

    return this;
  }
}
