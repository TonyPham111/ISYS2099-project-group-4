/*this table allow to show data in table row, column, it can use to view data and direct or do some action when click on row */
export default function DataTable({
  headerData,
  data,
  handleOnClick,
  hoverOnRow,
}) {
  return (
    <section className="w-full overflow-scroll rounded-xl">
      <table className=" w-full">
        <thead className="h-[50px] bg-custom-dark-100 p-3">
          <tr>
            {headerData.map((item, index) => (
              <td key={index}>{item}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              className={hoverOnRow ? "tr--hover" : ""}
              onClick={() => {
                handleOnClick(item, rowIndex);
              }}
              key={item.id}
            >
              {headerData.map((keyItem) => (
                <td key={keyItem + item.id}>{item[keyItem]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
