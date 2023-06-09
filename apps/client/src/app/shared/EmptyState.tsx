import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type Props = {
  icon?: JSX.Element;
  messages?: string[];
  style?: React.CSSProperties;
  wrapperRef?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
};

const Wrapper = styled.div<{ height: number | null }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  height: ${props => (props.height ? 'calc(100vh - ' + props.height + 'px)' : '100%')};
`;

const Message = styled.div`
  // margin-top: 5px;
  text-align: center;
`;

export function EmptyState(props: Props) {
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);
  const [icon, setIcon] = useState<JSX.Element | null>();
  const messages = props.messages || ['No data to display'];

  useEffect(() => {
    if (props.wrapperRef?.current) {
      setWrapperHeight(props.wrapperRef.current.offsetHeight);
    }
  }, [props.wrapperRef]);

  useEffect(() => {
    if (props.icon) {
      const cloned = React.cloneElement(props.icon, {
        style: { fontSize: '36px' },
        color: 'secondary',
      });
      setIcon(cloned);
    }
  }, [props.icon]);

  return (
    <Wrapper style={props.style} height={wrapperHeight}>
      {props.icon ? icon : <CheckCircleOutlineIcon style={{ fontSize: '36px' }} />}
      {messages.map((message, i) => (
        <Message key={i}>{message}</Message>
      ))}
      {props.children && <div style={{ marginTop: '10px' }}></div>}
      {props.children}
    </Wrapper>
  );
}
