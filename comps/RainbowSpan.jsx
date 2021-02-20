export default function RainbowSpan({ children, isHoverHighlight = false }) {
    return (
        <span
            className={`block xl:inline bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-300 to-pink-300 transition-all ease-in-out ${
                isHoverHighlight
                    ? 'hover:bg-gradient-to-r hover:from-blue-500 hover:via-green-200 hover:to-pink-200'
                    : null
            }`}
        >
            {children}
        </span>
    );
}
