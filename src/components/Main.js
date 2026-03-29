/** Primary content landmark for a11y (pair with layout skip link #main-content). */
export default function Main({ children, className }) {
    return (
        <main id="main-content" tabIndex={-1} className={className}>
            {children}
        </main>
    );
}
