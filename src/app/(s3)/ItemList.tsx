import { useEffect, useState } from "react";

import dayjs from "dayjs";

import { useS3 } from "@/hooks/useS3";

export default function ItemList() {
  const { authenticate, getList } = useS3();
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    authenticate((err) => {
      if (err) {
        console.log("🔶 認証エラー");
        console.error(err);
      } else {
        getList((err, data) => {
          if (err) {
            console.log("🔶 リスト取得エラー");
            console.error(err);
          } else {
            console.log("🔶 リスト取得");
            console.log(data);
            setFiles(data.Contents ?? [])
          }
        });
      }
    });
  }, []);

  return (
    <div>
      <div>Item List</div>
      <table>
        <thead>
          <tr>
            <td className="p-2">ファイル名</td>
            <td className="p-2">タイムスタンプ</td>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.ETag}>
              <td className="p-2">{file.Key}</td>
              <td className="p-2">{dayjs(file.LastModified).toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
