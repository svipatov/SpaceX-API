
const request = require('supertest');
const app = require('../../src/app');

beforeAll((done) => {
  app.on('ready', () => {
    done();
  });
});

//------------------------------------------------------------
//                     Launch Query Test
//------------------------------------------------------------

test('It should return launches with mongo id\'s', () => {
  return request(app).get('/v2/launches?id=true').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('_id');
    });
  });
});

test('It should return flight number 55', () => {
  return request(app).get('/v2/launches?flight_id=5a7a3dceb7afa5b79ec71628').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('flight_number', 55);
    });
  });
});

test('It should return flight number 42', () => {
  return request(app).get('/v2/launches?flight_number=42').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('flight_number', 42);
    });
  });
});

test('It should return flight 42 in date range', () => {
  return request(app).get('/v2/launches?start=2017-06-22&final=2017-06-25').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('flight_number', 42);
    });
  });
});

test('It should return launches in 2017', () => {
  return request(app).get('/v2/launches?launch_year=2017').then((response) => {
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toEqual(18);
  });
});

test('It should return flight 42 with given launch date in UTC', () => {
  return request(app).get('/v2/launches?launch_date_utc=2017-06-23T19:10:00Z').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('flight_number', 42);
    });
  });
});

test('It should return flight 42 with given launch date in local time', () => {
  return request(app).get('/v2/launches?launch_date_local=2017-06-23T15:10:00-04:00').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('flight_number', 42);
    });
  });
});

test('It should return launches with falcon9 rocket id', () => {
  return request(app).get('/v2/launches?rocket_id=falcon9').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('rocket.rocket_id', 'falcon9');
    });
  });
});

test('It should return launches with falcon 9 rocket name', () => {
  return request(app).get('/v2/launches?rocket_name=Falcon+9').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('rocket.rocket_name', 'Falcon 9');
    });
  });
});

test('It should return launches with FT rocket type', () => {
  return request(app).get('/v2/launches?rocket_type=FT').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('rocket.rocket_type', 'FT');
    });
  });
});

test('It should return launches with core serial B1029', () => {
  return request(app).get('/v2/launches?core_serial=B1029').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.first_stage.cores.forEach((core) => {
        expect(core).toHaveProperty('core_serial', 'B1029');
      });
    });
  });
});

test('It should return launches with cap serial C113', () => {
  return request(app).get('/v2/launches?cap_serial=C113').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.second_stage.payloads.forEach((cap) => {
        expect(cap).toHaveProperty('cap_serial', 'C113');
      });
    });
  });
});

test('It should return launches with 2 core flights', () => {
  return request(app).get('/v2/launches?core_flight=2').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.first_stage.cores.forEach((core) => {
        expect(core).toHaveProperty('flight');
      });
    });
  });
});

test('It should return launches with reused cores', () => {
  return request(app).get('/v2/launches?core_reuse=true').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item.reuse).toHaveProperty('core', true);
    });
  });
});

test('It should return launches with reused side core 1', () => {
  return request(app).get('/v2/launches?side_core1_reuse=true').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item.reuse).toHaveProperty('side_core1', true);
    });
  });
});

test('It should return launches with reused side core 2', () => {
  return request(app).get('/v2/launches?side_core2_reuse=true').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item.reuse).toHaveProperty('side_core2', true);
    });
  });
});

test('It should return launches with no reused fairings', () => {
  return request(app).get('/v2/launches?fairings_reuse=false').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item.reuse).toHaveProperty('fairings', false);
    });
  });
});

test('It should return launches with reused capsules', () => {
  return request(app).get('/v2/launches?capsule_reuse=true').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item.reuse).toHaveProperty('capsule', true);
    });
  });
});

test('It should return launches from LC-39A', () => {
  return request(app).get('/v2/launches?site_id=ksc_lc_39a').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item.launch_site).toHaveProperty('site_id', 'ksc_lc_39a');
    });
  });
});

test('It should return more launches from LC-39A', () => {
  return request(app).get('/v2/launches?site_name=KSC+LC+39A').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item.launch_site).toHaveProperty('site_name', 'KSC LC 39A');
    });
  });
});

test('It should return more launches from LC-39A long name', () => {
  return request(app).get('/v2/launches?site_name_long=Kennedy+Space+Center+Historic+Launch+Complex+39A').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item.launch_site).toHaveProperty('site_name_long', 'Kennedy Space Center Historic Launch Complex 39A');
    });
  });
});

test('It should return launch of BulgariaSat-1', () => {
  return request(app).get('/v2/launches?payload_id=BulgariaSat-1').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.second_stage.payloads.forEach((payload) => {
        expect(payload).toHaveProperty('payload_id', 'BulgariaSat-1');
      });
    });
  });
});

test('It should return launches with Bulgaria Sat customer', () => {
  return request(app).get('/v2/launches?customer=Bulgaria+Sat').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.second_stage.payloads.forEach((payload) => {
        payload.customers.forEach((customer) => {
          expect(customer).toContain('Bulgaria Sat');
        });
      });
    });
  });
});

test('It should return launches with Satellite payloads', () => {
  return request(app).get('/v2/launches?payload_type=Satellite').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.second_stage.payloads.forEach((payload) => {
        expect(payload).toHaveProperty('payload_type');
      });
    });
  });
});

test('It should return launches with GTO orbit', () => {
  return request(app).get('/v2/launches?orbit=GTO').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.second_stage.payloads.forEach((payload) => {
        expect(payload).toHaveProperty('orbit');
      });
    });
  });
});

test('It should return launches with successful launches', () => {
  return request(app).get('/v2/launches?launch_success=true').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      expect(item).toHaveProperty('launch_success');
    });
  });
});

test('It should return launches with core reuse', () => {
  return request(app).get('/v2/launches?reused=true').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.first_stage.cores.forEach((core) => {
        expect(core).toHaveProperty('reused');
      });
    });
  });
});

test('It should return launches with successful core landings', () => {
  return request(app).get('/v2/launches?land_success=true').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.first_stage.cores.forEach((core) => {
        expect(core).toHaveProperty('land_success');
      });
    });
  });
});

test('It should return launches with ASDS landing', () => {
  return request(app).get('/v2/launches?landing_type=ASDS').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.first_stage.cores.forEach((core) => {
        expect(core).toHaveProperty('landing_type');
      });
    });
  });
});

test('It should return launches with landings on OCISLY', () => {
  return request(app).get('/v2/launches?landing_vehicle=OCISLY').then((response) => {
    expect(response.statusCode).toBe(200);
    response.body.forEach((item) => {
      item.rocket.first_stage.cores.forEach((core) => {
        expect(core).toHaveProperty('landing_vehicle');
      });
    });
  });
});
