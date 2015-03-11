bbq.controller('TestCtrl', function($scope) {
    $scope.gravatarUrl = 'http://www.gravatar.com/avatar/692c58f37a3704944bd31c4cbcb287e7.png?s=100';
	$scope.count = 5;
    $scope.txt = {
        to:'You',
        from:'Me',
        contents:{
            txt:'Test message'
        }
    };
    $scope.append = function(item, str){
        return item+':'+str;
    };
	$scope.incrementCounter = function() {
		$scope.count++;
	};
    $scope.resetMessage = function(){
        $scope.message="";
    };
    var loremIpsum='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Que Manilium, ab iisque M. Quodcumque in mentem incideret, et quodcumque tamquam occurreret. Mihi enim erit isdem istis fortasse iam utendum. Illum mallem levares, quo optimum atque humanissimum virum, Cn. Si longus, levis dictata sunt. Duo Reges: constructio interrete. Nam aliquando posse recte fieri dicunt nulla expectata nec quaesita voluptate.'.split(' ');
    var hipsum='Hipsum single-origin coffee butcher gentrify, dreamcatcher art party Thundercats salvia cronut nostrud brunch. Migas meditation disrupt XOXO cold-pressed, pour-over organic aesthetic hashtag sed retro cred nesciunt Pinterest post-ironic. Art party chillwave normcore, placeat eiusmod fashion axe labore plaid Helvetica officia iPhone Portland craft beer mumblecore jean shorts. Post-ironic single-origin coffee fanny pack drinking vinegar.'.split(' ');

    $scope.items = loremIpsum.slice(0,10);

    $scope.showHipButton=true;
    $scope.addLi = function(){
        var arr= $scope.showHipButton ? loremIpsum : hipsum;
        var word=arr[$scope.items.length];
        $scope.items.push(word);
    };
    $scope.hipster = function(){
        for (var i = 0; i < $scope.items.length; i++) {
            $scope.items[i]=hipsum[i];
        }
        $scope.showHipButton= false;
    };
    $scope.ipsum = function(){
        for (var i = 0; i < $scope.items.length; i++) {
            $scope.items[i]=loremIpsum[i];
        }
        $scope.showHipButton= true;
    };

    $scope.names=[];

    $scope.addName=function(name, $event){
        $scope.names.push({
            name:'Name = '+ name + ', Event Data: x='+$event.x+', y='+$event.y
        });
        if($scope.names.length>4) {
            this.setAttribute('disabled','disabled');
            this.textContent = 'Maximum reached';
        }
    };
});
