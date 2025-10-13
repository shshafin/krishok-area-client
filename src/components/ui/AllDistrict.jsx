import { useMemo, useState, useCallback } from "react";

export default function AllDistrict() {
  const divisions = useMemo(
    () => [
      {
        className: "d-rajshahi district",
        title: "রাজশাহী বিভাগ এর জেলাসমূহ",
        count: 10,
        rows: [
          { no: 1, id: "1",  name: "চাঁপাইনবাবগঞ্জ" },
          { no: 2, id: "2",  name: "জয়পুরহাট" },
          { no: 3, id: "5",  name: "পাবনা" },
          { no: 4, id: "6",  name: "বগুড়া" },
          { no: 5, id: "7",  name: "রাজশাহী" },
          { no: 6, id: "8",  name: "সিরাজগঞ্জ" },
          { no: 7, id: "69", name: "নওগাঁ" },
          { no: 8, id: "70", name: "নাটোর" },
          { no: 9, id: "71", name: "maps" },
          { no: 10, id:"73", name: "alukhabo" },
        ],
      },
      {
        className: "d-rajshahi district",
        title: "চট্টগ্রাম বিভাগ এর জেলাসমূহ",
        count: 11,
        rows: [
          { no: 1,  id: "9",  name: "কুমিল্লা" },
          { no: 2,  id: "10", name: "ব্রাহ্মণবাড়িয়া" },
          { no: 3,  id: "11", name: "চাঁদপুর" },
          { no: 4,  id: "12", name: "লক্ষ্মীপুর" },
          { no: 5,  id: "13", name: "নোয়াখালী" },
          { no: 6,  id: "15", name: "খাগড়াছড়ি" },
          { no: 7,  id: "16", name: "রাঙ্গামাটি" },
          { no: 8,  id: "17", name: "বান্দরবান" },
          { no: 9,  id: "18", name: "চট্টগ্রাম" },
          { no: 10, id: "19", name: "কক্সবাজার" },
          { no: 11, id: "68", name: "ফেনী" },
        ],
      },
      {
        className: "d-rajশাহী district",
        title: "খুলনা বিভাগ এর জেলাসমূহ",
        count: 10,
        rows: [
          { no: 1, id: "20", name: "খুলনা" },
          { no: 2, id: "21", name: "চুয়াডাঙ্গা" },
          { no: 3, id: "22", name: "ঝিনাইদহ" },
          { no: 4, id: "23", name: "নড়াইল" },
          { no: 5, id: "24", name: "বাগেরহাট" },
          { no: 6, id: "25", name: "কুষ্টিয়া" },
          { no: 7, id: "26", name: "মাগুরা" },
          { no: 8, id: "27", name: "মেহেরপুর" },
          { no: 9, id: "28", name: "যশোর" },
          { no:10, id: "29", name: "সাতক্ষীরা" },
        ],
      },
      {
        className: "d-রাজশাহী district",
        title: "বরিশাল বিভাগ এর জেলাসমূহ",
        count: 6,
        rows: [
          { no: 1, id: "30", name: "বরিশাল" },
          { no: 2, id: "31", name: "পটুয়াখালী" },
          { no: 3, id: "32", name: "ভোলা" },
          { no: 4, id: "33", name: "পিরোজপুর" },
          { no: 5, id: "34", name: "বরগুনা" },
          { no: 6, id: "35", name: "ঝালকাঠি" },
        ],
      },
      {
        className: "d-রাজশাহী district",
        title: "সিলেট বিভাগ এর জেলাসমূহ",
        count: 4,
        rows: [
          { no: 1, id: "36", name: "সিলেট" },
          { no: 2, id: "37", name: "মৌলভীবাজার" },
          { no: 3, id: "38", name: "হবিগঞ্জ" },
          { no: 4, id: "39", name: "সুনামগঞ্জ" },
        ],
      },
      {
        className: "d-রাজশাহী district",
        title: "রংপুর বিভাগ এর জেলাসমূহ",
        count: 8,
        rows: [
          { no: 1, id: "40", name: "কুড়িগ্রাম" },
          { no: 2, id: "41", name: "গাইবান্ধা" },
          { no: 3, id: "42", name: "ঠাকুরগাঁও" },
          { no: 4, id: "43", name: "দিনাজপুর" },
          { no: 5, id: "44", name: "নীলফামারী" },
          { no: 6, id: "45", name: "পঞ্চগড়" },
          { no: 7, id: "46", name: "রংপুর" },
          { no: 8, id: "47", name: "লালমনিরহাট" },
        ],
      },
      {
        className: "d-রাজশাহী district",
        title: "ময়মনসিংহ বিভাগ এর জেলাসমূহ",
        count: 4,
        rows: [
          { no: 1, id: "48", name: "ময়মনসিংহ" },
          { no: 2, id: "49", name: "জামালপুর" },
          { no: 3, id: "50", name: "নেত্রকোনা" },
          { no: 4, id: "51", name: "শেরপুর" },
        ],
      },
      {
        className: "d-রাজশাহী district",
        title: "ঢাকা বিভাগ এর জেলাসমূহ",
        count: 13,
        rows: [
          { no: 1,  id: "52", name: "গাজীপুর" },
          { no: 2,  id: "53", name: "গোপালগঞ্জ" },
          { no: 3,  id: "54", name: "টাঙ্গাইল" },
          { no: 4,  id: "55", name: "ঢাকা" },
          { no: 5,  id: "56", name: "নরসিংদী" },
          { no: 6,  id: "57", name: "নারায়ণগঞ্জ" },
          { no: 7,  id: "58", name: "ফরিদপুর" },
          { no: 8,  id: "59", name: "মাদারিপুর" },
          { no: 9,  id: "60", name: "মানিকগঞ্জ" },
          { no:10,  id: "61", name: "মুন্সিগঞ্জ" },
          { no:11,  id: "62", name: "রাজবাড়ী" },
          { no:12,  id: "63", name: "শরিয়তপুর" },
          { no:13,  id: "64", name: "কিশোরগঞ্জ" },
        ],
      },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ id: "", name: "" });

  const randImg = (seed, w = 900, h = 500) =>
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

  const photoUrl = open ? randImg(`dist-photo-${selected.id}`) : "";
  const mapUrl   = open ? randImg(`dist-map-${selected.id}`, 700, 420) : "";

  const onClickDistrict = useCallback((id, name) => {
    setSelected({ id, name });
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <div className="district-name" style={{marginTop: "5rem"}}>
        {divisions.map((div, idx) => (
          <div className={div.className} key={idx}>
            <h3>
              {div.title} <span>[{div.count}]</span>
            </h3>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">নং</th>
                  <th scope="col">নাম</th>
                </tr>
              </thead>

              {div.rows.map((r) => (
                <tbody key={r.id}>
                  <tr>
                    <th scope="row">{r.no}</th>
                    <td className="dis-btn">
                      <span hidden className="obj">{r.id}</span>
                      <button
                        type="button"
                        className="distirctshowbox"
                        disid={r.id}
                        onClick={() => onClickDistrict(r.id, r.name)}
                      >
                        {r.name}
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        ))}
      </div>

      {/* EXACT structure you requested */}
      <div id="distirctmodal" style={{ display: open ? "block" : "none" }}>
        <div id="distirct-modal-box">
          <div className="distirct_data">
            <div><h4>{selected.name || ""}</h4></div>
            <div className="dis-img-details">
              <div className="dis-main-img">
                <img
                  className="distirct-img"
                  src={photoUrl || "admin/distirct-image/distirct-image"}
                  alt="district image"
                />
              </div>
              <h6></h6>
              <div className="dis-maps-img">
                <img
                  className="distirct-img"
                  src={mapUrl || "admin/distirct-image/district-maps-photo/district-maps-photo"}
                  alt="district map image"
                />
              </div>
            </div>
          </div>

          <div id="disclose" onClick={close}>X</div>
        </div>
      </div>
    </>
  );
}