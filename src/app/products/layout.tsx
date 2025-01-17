import { Head } from "@/components/Head/Index";
import ResponsiveHeader from "@/components/Header/Index";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <header>
                <ResponsiveHeader/>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default Layout;