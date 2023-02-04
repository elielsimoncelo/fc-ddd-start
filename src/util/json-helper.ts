export default class JsonHelper {
  public toJson(obj: any): string {
    let json = JSON.stringify(obj);

    Object.keys(obj).filter((key) => key[0] === '_').forEach((key) => {
      json = json.replace(key, key.substring(1));
    });

    return json;
  }
}
