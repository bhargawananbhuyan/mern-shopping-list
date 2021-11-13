function MonthView() {
  return (
    <section className="month-view">
      {`Plan for the month of ${new Date().toLocaleString("en-us", {
        month: "long",
      })}`}
    </section>
  );
}

export default MonthView;
