const Circle = ({ color = "#2263eb", size = 50 }) => {
    return (
        <div style={{ display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: "50%"
        }} />
    );
};

export default Circle