import KeyvSqlite from '@keyv/sqlite';
import Keyv from 'keyv';

let db: Keyv<any>;

export default function loadDB(): Keyv<any> {
	if (db) return db;
	db = new Keyv(new KeyvSqlite('sqlite://db.sqlite'));
	return db;
}
