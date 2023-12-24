import React, { useEffect } from 'react';
import Styled from 'styled-components';

const internals = {};

export default function TwoDDialog() {

    const { Dialog } = internals;

    return <Dialog>ZUUUUDE</Dialog>;
}

internals.Dialog = Styled.div`
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);
    background: white;
    padding: 20px 30px;
`;
