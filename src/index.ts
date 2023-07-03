import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import UUID "mo:base/UUID";

/**
 * This type represents a tuna record that can be listed on a ledger.
 */
type TunaRecord = {
  id: Text;
  vessel: Text;
  location: Text;
  holder: Text;
  createdAt: Time;
  updatedAt: ?Time;
};

type TunaPayload = {
  vessel: Text;
  location: Text;
  holder: Text;
};

let tunaRecordStorage = HashMap<Text, TunaRecord>.empty();

public func queryTuna(id: Text): Result<TunaRecord, Text> {
  let tunaRecord = HashMap.get(id, tunaRecordStorage);
  switch (tunaRecord) {
    case (?record) {
      return Result.Ok(record);
    }
    case _ {
      return Result.Err("A tuna record with id=" # id # " not found");
    }
  }
}

public func queryAllTuna(): Result<Array<TunaRecord>, Text> {
  let records = Array.fromIter(HashMap.values(tunaRecordStorage));
  return Result.Ok(records);
}

public func deleteTunaRecord(id: Text): Result<TunaRecord, Text> {
  let removedTuna = HashMap.remove(id, tunaRecordStorage);
  switch (removedTuna) {
    case (?record) {
      return Result.Ok(record);
    }
    case _ {
      return Result.Err("Couldn't delete a tuna record with id=" # id # ". Tuna record not found.");
    }
  }
}

public func recordTuna(payload: TunaPayload): Result<TunaRecord, Text> {
  let id = UUID.v4();
  let tunaRecord: TunaRecord = {
    id = id;
    vessel = payload.vessel;
    location = payload.location;
    holder = payload.holder;
    createdAt = Time.now();
    updatedAt = null;
  };
  HashMap.put(id, tunaRecord, tunaRecordStorage);
  return Result.Ok(tunaRecord);
}

public func changeTunaHolder(id: Text, holder: Text): Result<TunaRecord, Text> {
  let tunaRecord = HashMap.get(id, tunaRecordStorage);
  switch (tunaRecord) {
    case (?record) {
      let updatedTuna = { record with holder = holder; updatedAt = Time.now(); };
      HashMap.put(id, updatedTuna, tunaRecordStorage);
      return Result.Ok(updatedTuna);
    }
    case _ {
      return Result.Err("Couldn't update a tuna record with id=" # id # ". Tuna record not found");
    }
  }
}
