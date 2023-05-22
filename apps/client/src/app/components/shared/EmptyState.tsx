import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {
  icon: JSX.Element;
  messages: string[];
  wrapperRef?: React.RefObject<HTMLElement>;
};

const Wrapper = styled.div<{ height: number | null }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  height: ${(props) =>
    props.height ? 'calc(100vh - ' + props.height + 'px)' : '100%'};
`;

const Message = styled.div`
  margin-top: 10px;
  text-align: center;
`;

export function EmptyState(props: Props) {
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null);
  const [icon, setIcon] = useState<JSX.Element | null>(null);
  useEffect(() => {
    if (props.wrapperRef?.current) {
      setWrapperHeight(props.wrapperRef.current.offsetHeight);
    }
  }, [props.wrapperRef]);

  useEffect(() => {
    if (props.icon) {
      const cloned = React.cloneElement(props.icon, {
        style: { fontSize: '36px' },
      });
      setIcon(cloned);
    }
  }, [props.icon]);

  return (
    <Wrapper height={wrapperHeight}>
      <div>{icon}</div>
      {props.messages.map((message) => (
        <Message>{message}</Message>
      ))}
    </Wrapper>
  );
}
