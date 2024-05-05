<script lang="ts">
  import { setDefaultOptions } from 'date-fns';
  import { fi } from 'date-fns/locale';

  setDefaultOptions({ locale: fi });
</script>

<slot></slot>
