import Square from "./Square";

const Squareplot = ({ color, data, title }) => {
  return (
    <div>
      {data.map((value, i) => (
        <Square key={i} color={color} value={value} />
      ))}
      <div>
        <p style={{ fontWeight: "bold", marginBottom: 4 }}>{title}</p>
      </div>
    </div>
  );
};

export default Squareplot;
