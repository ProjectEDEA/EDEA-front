export const DiamondMarker = () => (
    <svg
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            // visibility: 'hidden'
        }}
    >
        <defs>
            {/* 枠だけのひし形マーカー */}
            <marker
                id="diamond"
                viewBox="0 0 20 20"
                refX="10"
                refY="10"
                markerWidth="12"
                markerHeight="12"
                orient="auto-start-reverse"
            >
                <path
                    d="M 10 0 L 20 10 L 10 20 L 0 10 Z"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                />
            </marker>

            {/* 塗りつぶされたひし形マーカー */}
            <marker
                id="diamondclosed"
                viewBox="0 0 20 20"
                refX="10"
                refY="10"
                markerWidth="12"
                markerHeight="12"
                orient="auto-start-reverse"
            >
                <path
                    d="M 10 0 L 20 10 L 10 20 L 0 10 Z"
                    fill="#000"
                />
            </marker>
        </defs>
    </svg>
);