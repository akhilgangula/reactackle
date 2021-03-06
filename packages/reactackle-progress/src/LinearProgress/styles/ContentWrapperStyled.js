import styled, { css } from 'styled-components';
import { extractThemeOrDefault, getValueString } from 'reactackle-core';

const style = ({ theme: themeFromProvider }) => {
  const theme = extractThemeOrDefault(themeFromProvider);
  
  const { thickness } = theme.reactackle.components.progress.linear;

  const {
    colourDefault,
  } = theme.reactackle.components.progress.linear.background;

  return css`
    height: ${getValueString(thickness)};
    background-color: ${colourDefault};
  `;
};

export const ContentWrapperStyled = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  order: 2;
  ${style}
`;

ContentWrapperStyled.displayName = 'ContentWrapperStyled';
