<template>
  <div>
    <div class="po-password-strength-bar" :class="bar"></div>
  </div>
</template>

<script>
export default {
  name: 'password-meter',
  props: {
    strength: Number
  },

  computed: {
    bar () {
      const strength = this.score(this.strength)

      return {
        [strength]: true
      }
    }
  },

  methods: {
    score (score) {
      switch (score) {
        case 0:
          return 'risky'
        case 1:
          return 'guessable'
        case 2:
          return 'weak'
        case 3:
          return 'safe'
        case 4:
          return 'secure'
        default:
          return null
      }
    }
  }
}
</script>

<style>
.po-password-strength-bar {
  border-radius: 2px;
  height: 5px;
}

.po-password-strength-bar.risky {
  background-color: #f95e68;
}
.po-password-strength-bar.guessable {
  background-color: #fb964d;
}
.po-password-strength-bar.weak {
  background-color: #fdd244;
}
.po-password-strength-bar.safe {
  background-color: #b0dc53;
}
.po-password-strength-bar.secure {
  background-color: #35cc62;
}
</style>
