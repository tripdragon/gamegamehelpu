import { Keyboard } from 'alexandria/gamepad/keyboard';

export default (store) => {

  store.setState({
    keyboard: new Keyboard()
  });
};
