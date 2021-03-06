define('child', ['npc', 'peaceful'], function() {

    var names = [
        'Susie',
        'Elton',
        'Mavis',
        'Sam',
        'Little Billy'
    ];

    var name = names[Math.random() * names.length | 0];

    var image = 'child' + (Math.random() * 2 + 1 | 0);

    function getSize() {
        return 1;
    }

    function getHealth() {
        return 100;
    }

    var halfLevWidth;
    var halfLevHeight;

    // When the entity gets past this distance, it will try to get back to
    // the center of the region.
    var NERVOUS_DISTANCE = 20;

    return {
        setup: function(sup) {
            sup();
            trigger('schedule', function() {
                trigger('wander');
            }, 100);
            halfLevHeight = getLevHeight() / 2;
            halfLevWidth = getLevWidth() / 2;
        },

        getData: function(sup) {
            var data = sup();
            data.proto = 'avatar';
            data.image = image;
            data.width = data.height = getSize();
            data.speed = 0.004;
            data.nametag = name;
            return data;
        },
        nametag: function() {
            return name;
        },
        getWidth: getSize,
        getHeight: getSize,
        getHealth: getHealth,

        seenEntity: function(sup, id, body, dist) {
            sup();
            if (getType(id) == 'bully') trigger('flee', id);
        },

        stagePathElements: function(sup, x, y) {
            sup();
            if (Math.abs(x - halfLevWidth) > NERVOUS_DISTANCE ||
                Math.abs(y - halfLevHeight) > NERVOUS_DISTANCE) {
                stageAttractorCoord(halfLevWidth, halfLevHeight);
            }
        },
        type: function() {
            return 'child';
        }
    };
});
