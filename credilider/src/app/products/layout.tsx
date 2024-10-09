import { Head } from "@/components/Head/Index";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <header>
                <Head />
            </header>
            <main>{children}</main>
        </div>
    );
};

export default Layout;