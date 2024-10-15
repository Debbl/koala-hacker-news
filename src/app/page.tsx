"use client";
import { format } from "date-fns";
import DATA from "../data/data.json";

export default function Home() {
  return (
    <main className="h-full">
      <div className="mt-12 pl-12">
        {DATA.map((i) => (
          <div className="mt-8" key={i.bvid}>
            <div className="text-xs text-gray-600">
              {format(i.date * 1000, "yyyy-MM-dd")}
            </div>

            <h3>
              <a href={`https://www.bilibili.com/video/${i.bvid}`} id={i.bvid}>
                {i.title}
              </a>
            </h3>

            <p className="mt-2 text-xs text-gray-500">{i.desc}</p>

            <table className="mt-4 table-fixed">
              <thead>
                <tr>
                  <th scope="col">时间轴</th>
                  <th scope="col">简介</th>
                  <th scope="col">链接</th>
                </tr>
              </thead>
              <tbody>
                {i.hn_items.times.map((time, index) => (
                  <tr key={index}>
                    <td>
                      <a
                        href={`https://www.bilibili.com/video/${i.bvid}?t=${
                          time.minutes * 60 + time.seconds
                        }`}
                      >
                        {`${time.minutes}`.padStart(2, "0")}:
                        {`${time.seconds}`.padStart(2, "0")}
                      </a>
                    </td>
                    <td>{i.hn_items.introduces[index]}</td>
                    <td>
                      {Array.isArray(i.hn_items.links[index]) ? (
                        i.hn_items.links[index]?.map((link, j) => (
                          <a href={link} key={j}>
                            {link}
                          </a>
                        ))
                      ) : (
                        <a href={i.hn_items.links[index]}>
                          {i.hn_items.links[index]}
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </main>
  );
}
