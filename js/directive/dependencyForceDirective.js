'use strict';

angular.module(__global.appName).directive("dependencyForce", function (colorutil, util) {
    function link(scope) {
        var gLines;
        var gNodes;
        var width = scope.width;
        var height = scope.height;

        var dependencies;
        var names;

        var force;
        var nodes;
        var links = [];
        var linksData;
        var reverseNodesMap;

        var rangeScale;

        function initSvg(forceId, width, height) {
            var svg = d3.select("#" + forceId)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            gLines = svg.append("g");
            gNodes = svg.append("g");
        }

        function initRangeScale(step) {
            var countValues = dependencies.map(util.makeAccessorFunction("count")).sort(d3.ascending);
            var p;

            rangeScale = [];
            for(p = 1; p >= 0; p -= step) {
                rangeScale.push(Math.floor(d3.quantile(countValues, p)));
            }
        }

        function createNodes() {
            nodes = [];
            reverseNodesMap = {};

            names.forEach(function (name) {
                var node = {
                    name: name
                };
                nodes.push(node);
                reverseNodesMap[name] = node;
            });
        }

        function createDistanceFunction(minDistance, maxDistance) {
            var countAccessor = util.makeAccessorFunction("count");
            var minCount = d3.min(dependencies, countAccessor);
            var maxCount = d3.max(dependencies, countAccessor);

            var distanceFunction = d3.scale.ordinal()
                .domain(d3.range(minCount, maxCount + 1))
                .rangePoints([maxDistance, minDistance]);

            return distanceFunction;
        }

        function createLinks(countThreshold) {
            var distanceFunction = createDistanceFunction(1, 50);
            links.length = 0;

            dependencies.forEach(function (dependency) {
                if (dependency.count >= countThreshold) {
                    var fromNode = reverseNodesMap[dependency.from];
                    var toNode = reverseNodesMap[dependency.to];
                    if (util.isDefined(fromNode) && util.isDefined(toNode)) {
                        var link = {
                            source: fromNode,
                            target: toNode,
                            distance: distanceFunction(dependency.count)
                        };
                        links.push(link);
                    }
                }
            });
        }

        function createForce(minDistance, maxDistance) {
            force = d3.layout.force()
                .size([width, height])
                .nodes(nodes)
                .links(links)
                .linkDistance(function (d) {
                    return d.distance;
                })
                .charge(-1000);
        }

        function updateNode() {
            this
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }

        function updateText() {
            this
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                });
        }

        function updateLink() {
            this
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
        }

        function startForce() {
            force.on("tick", function () {
                gNodes.selectAll("circle.node")
                    .call(updateNode);
                gNodes.selectAll("text.node")
                    .call(updateText);
                gLines.selectAll("line.link")
                    .call(updateLink);
            });

            force.start();
        }

        function drawNodesAndTexts() {
            var colorFunction = colorutil.colorFunction(names);

            var nodesData = gNodes.selectAll("circle.node")
                .data(force.nodes(), function (d) {
                    return d.name;
                });

            nodesData.enter()
                .append("svg:circle")
                .attr("r", 15)
                .attr("class", "node")
                .attr("fill-opacity", 0.5)
                .style("stroke", "gray")
                .style("stroke-width", 0.5)
                .attr("fill", function (d) {
                    return colorFunction(d.name);
                })
                .call(force.drag);

            nodesData.enter()
                .append("svg:text")
                .attr("font-size", "8")
                .attr("class", "node")
                .text(function (d) {
                    return d.name;
                });

            nodesData.exit().remove();
        }

        function linksEnterAndExit() {
            var i = 0;
            linksData.enter()
                .append("svg:line")
                .attr("class", function(d) {
                    i++;
                    return "link";
                })
                .style("stroke-width", .5);

            console.log("i:" + i);

            linksData.exit().remove();
        }

        function drawLinks() {
            console.log("old links: " + d3.selectAll("line.link")[0].length)
            console.log("new links: " + force.links().length);
            linksData = gLines.selectAll("line.link")
                .data(force.links(), function (d) {
                    return d.source.name + "-" + d.target.name;
                });

            linksEnterAndExit();
        }

        function thresholdChanged() {
            update(rangeScale[scope.rangeValue]);
        }

        function update(countThreshold) {
            force.stop();
            createLinks(countThreshold);
            drawLinks();
            startForce();
        }

        scope.ready.then(function (data) {
            dependencies = data.dependencies;
            names = data.names;
            initSvg(scope.forceId, scope.width, scope.height);
            createNodes();
            createLinks(Number.MAX_VALUE);
            createForce();
            startForce();
            drawNodesAndTexts();
            drawLinks();

            initRangeScale(0.02);

            scope.rangeMin = 0;
            scope.rangeMax = rangeScale.length - 1;
            scope.rangeValue = 0;
            scope.thresholdChanged = thresholdChanged;
        });
    }

    return {
        link: link,
        scope: {
            forceId: "@",
            width: "@",
            height: "@",
            ready: "="
        },
        restrict: "E",
        templateUrl: "html/templates/dependencyForceDirective.html"
    }

});