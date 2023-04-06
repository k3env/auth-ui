<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { TLoginResponse } from './+page.server';

  export let data: PageData;
  let showPass: boolean;
  let form = $page.form as string | null;
</script>

<div class="container font-mono flex flex-col items-center">
  <h2 class="text-2xl pb-2">Login</h2>
  <form class="flex flex-col gap-2 container w-3/5 items-stretch" method="post" use:enhance>
    <label for="username">Username: </label>
    <input type="text" name="username" id="username" />
    <label for="password">Password: </label>
    <input type={showPass ? 'text' : 'password'} name="password" id="password" />
    <input type="hidden" value={data.callback} name="callback" />
    <label for="showPass"
      >Show password
      <input type="checkbox" id="showPass" bind:checked={showPass} />
    </label>
    {#if $page.form}
      <p class="error">Error: {$page.form}</p>
      <!-- {:else}
      {goto(data.callback ?? '/')} -->
    {/if}
    {#if data.callback}
      <p>On successfull login you will be redirected to {data.callback}</p>
    {/if}
    <button type="submit" class="primary">Login</button>
  </form>
</div>
