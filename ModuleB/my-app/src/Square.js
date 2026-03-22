const Square = ({color, value}) => {
    return (
        <div
        style={{
            backgroundColor: color,
            width: value,
            height: 120,
            margin: 5
        }}
        />
    );
};
export default Square;