const PortalRequests = () => (
  <div className="max-w-[860px] mx-auto">
    <h2 className="font-display text-[26px] font-semibold mb-1">Inkomna förfrågningar</h2>
    <p className="text-muted-foreground text-[15px] mb-5">Kunder som räknat ut ett pris och tryckt "Skicka förfrågan" hamnar här.</p>
    <div className="bg-card border border-border rounded p-8 text-center">
      <div className="text-3xl mb-3">📩</div>
      <p className="text-muted-foreground text-sm">Inga förfrågningar ännu. När en kund skickar en förfrågan via prisverktyget dyker den upp här.</p>
    </div>
  </div>
);

export default PortalRequests;
