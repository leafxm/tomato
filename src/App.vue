<template>
  <div id="wrapper" style="overflow-x:hidden">
    <nav class="navbar navbar-default">
      <!-- <div class="container"> -->
        <a class="navbar-brand" href="#">
          <i class="glyphicon glyphicon-time"></i>
          番茄土豆
        </a>
     <!--  </div> -->
    </nav>
      <div class="container">
        <template v-if = 'width'>
          <div class="col-sm-4">
            <component-plan></component-plan>
          </div>
          <div class="col-sm-4">
            <component-clock></component-clock>
          </div>
          <div class="col-sm-4">
            <component-acco v-bind:adone = "done"></component-acco>
          </div>
        </template>
         <template v-else>
           <div class="col-sm-12">
          <header>
            <a  @click = 'plan = !plan'>{{link[+plan]}}</a>
          </header>
          <component-clock></component-clock>
          <component-plan v-show = 'plan'></component-plan>
          <component-acco v-show = '!plan' v-bind:adone = "done"></component-acco>
         </template>
         </div>
     </div>
  </div>
</template>
<script>
  import componentPlan from './components/componentPlan.vue'
  import componentClock from './components/componentClock.vue'
  import componentAcco from './components/componentAcco.vue'
  export default {
    data () {
      return {
        done: {
          thing: '',
          startTime: '',
          endTime: ''
        },
        getThing: false,
        width: true,
        plan: 1,
        link: ['plan', 'done']
      }
    },
    ready () {
      if (document.body.clientWidth < 800) {
        this.width = false
      }
    },
    components: {
      'component-plan': componentPlan,
      'component-clock': componentClock,
      'component-acco': componentAcco
    },
    events: {
      'getDone': function (todo) {
        if (this.getThing) {
          this.done.thing = todo
          this.getThing = false
        }
      },
      'hasDone': function (time) {
        this.getThing = true
        this.done.startTime = time.startTime
        this.done.endTime = time.endTime
      }
    }
  }
</script>


