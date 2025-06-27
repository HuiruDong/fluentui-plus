import styled from '@emotion/styled';
import { tokens } from '@fluentui/react-components';

export const StyledTag = styled.span<{ bordered?: boolean }>`
  box-sizing: border-box;
  margin: 0;
  color: ${tokens.colorNeutralForeground1};
  font-size: ${tokens.fontSizeBase200};
  line-height: calc(${tokens.lineHeightBase200} * ${tokens.fontSizeBase200});
  list-style: none;
  font-family: ${tokens.fontFamilyBase};
  height: auto;
  padding: 0 ${tokens.spacingHorizontalS};
  white-space: nowrap;
  background: ${tokens.colorNeutralBackground2};
  border: ${tokens.strokeWidthThin} solid ${tokens.colorNeutralBackground2Hover};
  border-radius: ${tokens.borderRadiusMedium};
  opacity: 1;
  text-align: start;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  flex-wrap: nowrap;
  gap: ${tokens.spacingHorizontalS};
  align-items: center;
  transition: all ${tokens.durationNormal} ${tokens.curveEasyEase};
  cursor: pointer;

  /* 动态样式 */
  ${({ bordered }) => !bordered && `
    border: none;
  `}

  &:hover {
    background: ${tokens.colorNeutralBackground2Hover};
  }
`;

export const TagContent = styled.span`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TagClose = styled.span`
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

export const StyledCheckableTag = styled(StyledTag)<{ checked?: boolean }>`
  cursor: pointer !important;
  
  ${({ checked }) => checked && `
    background-color: ${tokens.colorBrandBackground} !important;
    color: ${tokens.colorNeutralForegroundOnBrand} !important;
    border-color: ${tokens.colorBrandBackground} !important;
    
    &:hover {
      background-color: ${tokens.colorBrandBackgroundHover} !important;
    }
  `}
`;
