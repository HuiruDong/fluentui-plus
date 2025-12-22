import InternalLayout from './Layout';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import Sider from './Sider';

export type { LayoutProps, HeaderProps, FooterProps, ContentProps, SiderProps } from './types';

type CompoundedComponent = typeof InternalLayout & {
  Header: typeof Header;
  Footer: typeof Footer;
  Content: typeof Content;
  Sider: typeof Sider;
};

const Layout = InternalLayout as CompoundedComponent;
Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;
Layout.Sider = Sider;

export default Layout;
