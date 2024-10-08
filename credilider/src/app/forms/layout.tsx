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
            <footer>
                <p>&copy; 2024 Credilider. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;