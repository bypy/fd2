function HashStorage() {
    var storage = {}; // непосредственно хранилище
    var self = this;

    // сохраняет указанное значение под указанным ключом
    self.addValue = function(k,v) {
        storage[k] = v;
    };

    // возвращает значение по указанному ключу либо undefined
    self.getValue = function(k) {
        if ( k in storage ) {
            return storage[k];
        }
    };
    
    // удаляет значение с указанным ключом,
    // возвращает true если значение было удалено
    // и false если такого значения не было в хранилище
    self.deleteValue = function(k) {
        // спорный момент насчет регистра
        var result = false;
        if ( k in storage ) {
            delete storage[k];
            result = true;
        }
        return result;
    };

    // возвращает массив, состоящий из одних ключей
    self.getKeys = function(){
        return Object.keys(storage);
    };
}