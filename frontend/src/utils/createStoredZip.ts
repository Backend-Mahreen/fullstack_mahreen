type ZipEntries = Readonly<Record<string, Uint8Array>>;

const ZIP_LOCAL_FILE_SIGNATURE = 0x04034b50;
const ZIP_CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const ZIP_END_SIGNATURE = 0x06054b50;
const ZIP_VERSION = 20;
const ZIP_UTF8_FLAG = 0x0800;

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const crc32 = (bytes: Uint8Array) => {
  let checksum = 0xffffffff;
  bytes.forEach((byte) => {
    checksum = crcTable[(checksum ^ byte) & 0xff] ^ (checksum >>> 8);
  });
  return (checksum ^ 0xffffffff) >>> 0;
};

const uint16 = (value: number) => {
  const bytes = new Uint8Array(2);
  new DataView(bytes.buffer).setUint16(0, value, true);
  return bytes;
};

const uint32 = (value: number) => {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value >>> 0, true);
  return bytes;
};

const concatBytes = (chunks: readonly Uint8Array[]) => {
  const totalLength = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  });
  return output;
};

const getDosDateTime = (date: Date) => {
  const year = Math.max(1980, date.getFullYear());
  return {
    date:
      ((year - 1980) << 9) |
      ((date.getMonth() + 1) << 5) |
      date.getDate(),
    time:
      (date.getHours() << 11) |
      (date.getMinutes() << 5) |
      Math.floor(date.getSeconds() / 2),
  };
};

export const encodeUtf8 = (value: string) => new TextEncoder().encode(value);

export const createStoredZip = (entries: ZipEntries) => {
  const localRecords: Uint8Array[] = [];
  const centralRecords: Uint8Array[] = [];
  const timestamp = getDosDateTime(new Date());
  let localOffset = 0;

  Object.entries(entries).forEach(([name, data]) => {
    const nameBytes = encodeUtf8(name);
    const checksum = crc32(data);
    const localRecord = concatBytes([
      uint32(ZIP_LOCAL_FILE_SIGNATURE),
      uint16(ZIP_VERSION),
      uint16(ZIP_UTF8_FLAG),
      uint16(0),
      uint16(timestamp.time),
      uint16(timestamp.date),
      uint32(checksum),
      uint32(data.byteLength),
      uint32(data.byteLength),
      uint16(nameBytes.byteLength),
      uint16(0),
      nameBytes,
      data,
    ]);
    const centralRecord = concatBytes([
      uint32(ZIP_CENTRAL_DIRECTORY_SIGNATURE),
      uint16(ZIP_VERSION),
      uint16(ZIP_VERSION),
      uint16(ZIP_UTF8_FLAG),
      uint16(0),
      uint16(timestamp.time),
      uint16(timestamp.date),
      uint32(checksum),
      uint32(data.byteLength),
      uint32(data.byteLength),
      uint16(nameBytes.byteLength),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(0),
      uint32(localOffset),
      nameBytes,
    ]);

    localRecords.push(localRecord);
    centralRecords.push(centralRecord);
    localOffset += localRecord.byteLength;
  });

  const centralDirectory = concatBytes(centralRecords);
  const endRecord = concatBytes([
    uint32(ZIP_END_SIGNATURE),
    uint16(0),
    uint16(0),
    uint16(centralRecords.length),
    uint16(centralRecords.length),
    uint32(centralDirectory.byteLength),
    uint32(localOffset),
    uint16(0),
  ]);

  return concatBytes([...localRecords, centralDirectory, endRecord]);
};
