<template>
  <div class="text-h3 font-weight-bold">
    キャラ対メモ
  </div>

  <div class="my-10" />

  <template v-if="folders.length">
    <v-row>
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="8"
        xl="8"
      >
        <div class="d-flex">
          <span class="text-h5">
            フォルダ一覧
          </span>
          <v-spacer />
          <v-btn
            color="indigo-accent-4"
            class="mb-2 mr-2"
            @click="handleOpenFolderCreateDialog"
          >
            フォルダの追加
          </v-btn>
        </div>
        <v-list lines="two">
          <template
            v-for="folderItem in sortedFolders"
            :key="folderItem.id"
          >
            <div class="list-item-folder">
              <v-list-item
                :title="folderItem.name"
                :subtitle="dateFormat(folderItem.updatedAt)"
                :to="{ path: '/null' }"
                :prepend-icon="mdiFolder"
              />
              <v-btn
                icon
                density="compact"
                variant="plain"
                class="list-item-folder-info"
              >
                <v-icon :icon="mdiInformationOutline" />
                <v-menu activator="parent">
                  <v-list density="compact">
                    <v-list-item @click="handleOpenFolderEditDialog(folderItem)">
                      <v-list-item-title>
                        <span>
                          フォルダを編集する
                        </span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="handleOpenFolderDeleteDialog(folderItem)">
                      <v-list-item-title>
                        <span class="text-error">
                          フォルダを削除する
                        </span>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </template>

  <template v-else>
    <div class="text-body-1 font-weight-bold">
      まだ、フォルダがありません<br>
    </div>

    <div class="my-8" />

    <div class="text-body-1 font-weight-bold">
      フォルダの追加から自分の使用ファイターを選択して、フォルダを追加しましょう
    </div>

    <div class="my-8" />

    <v-row class="mx-16 mt-5">
      <v-btn
        color="indigo-accent-4"
        @click="handleOpenFolderCreateDialog"
      >
        フォルダの追加
      </v-btn>
    </v-row>
  </template>
  <div class="justify-center">
    <v-dialog
      v-model="folderCreateDialog"
      width="700px"
    >
      <v-card>
        <v-card-title class="ma-2">
          <span class="text-h5 font-weight-bold">フォルダの追加</span>
        </v-card-title>
        <v-card-text>
          <form>
            <v-text-field
              v-model="v$.folder.name.$model"
              :error-messages="v$.folder.name.$errors.map(e => e.$message)"
              :counter="20"
              name="フォルダ名"
              label="フォルダ名"
              hint="未入力の場合、下記の使用ファイター名が設定されます"
              variant="underlined"
            />
            <v-autocomplete
              v-model="v$.folder.fighterId.$model"
              :error-messages="v$.folder.fighterId.$errors.map(e => e.$message)"
              :items="fightersArray"
              item-value="id"
              item-title="name"
              clearable
              :menu-props="{ location: 'top', scrollStrategy: 'none' }"
              name="使用ファイター"
              label="使用ファイター"
              hint="自分の使用ファイターを選択してください"
              variant="underlined"
            />
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="handleCloseFolderDialog">
            キャンセル
          </v-btn>
          <v-btn
            class="mr-4"
            color="indigo-accent-4"
            @click="handleFolderCreate"
          >
            作成
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div class="justify-center">
    <v-dialog
      v-model="folderEditDialog"
      width="700px"
    >
      <v-card>
        <v-card-title class="ma-2">
          <span class="text-h5 font-weight-bold">フォルダの編集</span>
        </v-card-title>
        <v-card-text>
          <form>
            <v-text-field
              v-model="v$.folder.name.$model"
              :error-messages="v$.folder.name.$errors.map(e => e.$message)"
              :counter="20"
              name="フォルダ名"
              label="フォルダ名"
              hint="未入力の場合、下記の使用ファイター名が設定されます"
              variant="underlined"
            />
            <v-autocomplete
              v-model="v$.folder.fighterId.$model"
              :error-messages="v$.folder.fighterId.$errors.map(e => e.$message)"
              :items="fightersArray"
              item-value="id"
              item-title="name"
              clearable
              :menu-props="{ location: 'top', scrollStrategy: 'none' }"
              name="使用ファイター"
              label="使用ファイター"
              hint="自分の使用ファイターを選択してください"
              variant="underlined"
            />
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="handleCloseFolderDialog">
            キャンセル
          </v-btn>
          <v-btn
            class="mr-4"
            color="indigo-accent-4"
            @click="handleFolderUpdate"
          >
            更新
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div class="justify-center">
    <v-dialog
      v-model="folderDeleteDialog"
      width="500px"
    >
      <v-card>
        <v-card-title class="ma-2">
          <span class="text-h5 font-weight-bold">フォルダの削除</span>
        </v-card-title>
        <v-card-text>
          「{{ folder.name }}」フォルダを削除してもよろしいですか？
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="handleCloseFolderDialog">
            キャンセル
          </v-btn>
          <v-btn
            class="mr-4"
            color="error"
            @click="handleFolderDelete"
          >
            削除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { mapGetters, mapActions } from 'vuex';
import dayjs from 'dayjs';
import { 
  mdiFolder,
  mdiInformationOutline
} from '@mdi/js';
import {
  required,
  maxLength,
  helpers
} from '@vuelidate/validators';
import {
  requiredMessage,
  maxLengthMessage
} from '../../../plugins/validationMessages';
import {
  serverErrorAlertStatus
} from '../../../plugins/alertStatus';
import { FIGHTERS_ARRAY } from '../../../plugins/fightersArray';

export default {
  name: "MatchupFoldersIndex",
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      folderCreateDialog: false,
      folderEditDialog: false,
      folderDeleteDialog: false,
      folder: {
        id: null,
        name: "",
        type: "MatchupFolder",
        fighterId: null
      },
      fightersArray: FIGHTERS_ARRAY,
      mdiFolder,
      mdiInformationOutline
    };
  },
  validations () {
    return {
      folder: {
        name: { 
          maxLength: helpers.withMessage(maxLengthMessage(20), maxLength(20))
        },
        fighterId: {
          required: helpers.withMessage(requiredMessage("使用ファイター"), required)
        }
      }
    };
  },
  computed: {
    ...mapGetters("folders", ["folders"]),
    sortedFolders() {
      return this.folders.slice().sort((a, b) => {
        if (a.updatedAt > b.updatedAt) return -1;
        if (a.updatedAt < b.updatedAt) return 1;
        return 0;
      });
    }
  },
  mounted() {
    this.$store.dispatch("folders/fetchFolders", "matchup");
  },
  methods: {
    ...mapActions("folders", [
      "createFolder",
      "updateFolder",
      "deleteFolder"
    ]),
    ...mapActions("alert", ["displayAlert"]),
    async handleFolderCreate() {
      const result = await this.v$.$validate();

      if (!result) return;

      try {
        await this.createFolder(this.folder);
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
      }
      this.handleCloseFolderDialog();
    },
    async handleFolderUpdate() {
      const result = await this.v$.$validate();

      if (!result) return;

      try {
        await this.updateFolder(this.folder);
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
      }
      this.handleCloseFolderDialog();
    },
    async handleFolderDelete() {
      try {
        await this.deleteFolder(this.folder);
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
      }
      this.handleCloseFolderDialog();
    },
    handleOpenFolderCreateDialog() {
      this.folderCreateDialog = true;
    },
    handleOpenFolderEditDialog(folder) {
      this.folder = Object.assign({}, folder);
      this.folderEditDialog = true;
    },
    handleOpenFolderDeleteDialog(folder) {
      this.folder = Object.assign({}, folder);
      this.folderDeleteDialog = true;
    },
    handleCloseFolderDialog() {
      this.folder.name = "";
      this.folder.fighterId = null;
      this.v$.$reset();
      this.folderCreateDialog = false;
      this.folderEditDialog = false;
      this.folderDeleteDialog = false;
    },
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style scoped>
.list-item-folder {
  position: relative;
}

.list-item-folder-info {
  position: absolute;
  top: 25%;
  right: 2%
}
</style>