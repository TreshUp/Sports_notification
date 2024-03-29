const { Soup, GLib, Gio } = imports.gi;

class base_api {
  #m_api;
  #m_engine;

  constructor(value, eng) {
    this.#m_api = value;
    this.#m_engine = eng;
  }

  get_api() {
    return this.#m_api;
  }

  get_engine() {
    return this.#m_engine;
  }

  get_value_by_keys(next, keys) {
    for (let key of keys)
      if (Array.isArray(next)) next = next[0][key];
      else next = next[key];
    return next;
  }
}

class hockey_nhl_api extends base_api {
  #m_home;
  #m_away;
  #m_date;
  #m_sport_idx = 1;
  #m_league_idx = 0;
  constructor(eng) {
    super("https://statsapi.web.nhl.com/api/v1", eng);
  }

  // TODO in base class
  prepare_info(json_answ) {
    let base_keys = ["teams", "nextGameSchedule", "dates", "games"];
    let utc_date = new Date(
      this.get_value_by_keys(json_answ, [].concat(base_keys, "gameDate"))
    );

    let away = this.get_value_by_keys(
      json_answ,
      [].concat(base_keys, ["teams", "away", "team", "name"])
    );
    let home = this.get_value_by_keys(
      json_answ,
      [].concat(base_keys, ["teams", "home", "team", "name"])
    );

    // TODO in base class
    this.#m_home = home;
    this.#m_away = away;
    this.#m_date = utc_date;
  }

  // TODO more elegant
  get_info() {
    let async_send = async (url) => {
      let httpSession = new Soup.Session();
      let message = Soup.Message.new("GET", url);

      try {
        let in_stream = httpSession.send(message, null);
        console.log("Status: " + httpSession.send_message(message));
        console.log("init1");
        let uint_arr = in_stream.read_bytes(4096, null);
        let str = new TextDecoder().decode(uint_arr.get_data());
        let json_answ = JSON.parse(str);

        this.prepare_info(json_answ);
      } catch (e) {
        console.log(e);
      }
    };

    (async () => {
      await async_send(this.get_api() + "/teams/17?expand=team.schedule.next");
    })();

    console.log(this.#m_date + " " + this.#m_away + " " + this.#m_home);

    // // TODO if eng
    // let eng = this.get_engine();

    // // TODO ID
    // const asyncExample = async () => {
    //     const result = await fetch(this.get_api() + '/teams/17?expand=team.schedule.next');

    //     return result.json();
    // };
    // (async () => {
    //     const json_answ = await asyncExample();

    //     let base_keys = ['teams', 'nextGameSchedule', 'dates', 'games'];
    //     let utc_date = new Date(this.get_value_by_keys(json_answ, [].concat(base_keys, 'gameDate')));

    //     let away = this.get_value_by_keys(json_answ, [].concat(base_keys, ['teams', 'away', 'team', 'name']));
    //     let home = this.get_value_by_keys(json_answ, [].concat(base_keys, ['teams', 'home', 'team', 'name']));
    //     console.log(utc_date + ' ' + away + ' ' + home);
    // })()
  }
}

class auto_f1_api extends base_api {
  #m_where;
  #m_date;
  #m_sport_idx = 0;
  #m_league_idx = 0;
  constructor(eng) {
    super("https://ergast.com/api/f1/current", eng);
  }
}

/**/
//    This part of file is automatically generated by api2db.py.
//    All changes will be deleted.
var class_dict = {};
class_dict['0_0'] = new auto_f1_api(0);
class_dict['1_0'] = new hockey_nhl_api(0);

function get_class_by_key(key)
{
    return class_dict[key];
}