<template>
    <div id="userSet" class="main-container">
        <header class="main-header">用户看板定义</header>
        <div class="table-data">
            <el-table
                ref="multipleTable"
                :data="userSetData"
                tooltip-effect="dark"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :default-sort="{prop: 'date', order: 'descending'}"
            >
                <el-table-column type="selection" width="55" label="显示"></el-table-column>
                <el-table-column prop="userSetId" label="看板ID"></el-table-column>
                <el-table-column prop="logo" label="logo">
                    <template slot-scope="scope">
                        <img :src="scope.row.logo" class="table-avatar">
                    </template>
                </el-table-column>
                <el-table-column prop="userSetUnit" label="看板单位"></el-table-column>
                <el-table-column prop="userSetName" label="看板名称"></el-table-column>
                <el-table-column prop="userTableName" label="详情表头"></el-table-column>
                <el-table-column prop="searchTableName" label="查询字段"></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="deleteRow(scope.$index, userSetData)"
                            type="text"
                        >编辑</el-button>
                        <el-button
                            @click.native.prevent="deleteRow(scope.$index, userSetData)"
                            type="text"
                        >删除</el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="日期" width="120"  sortable prop="date">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>-->
            </el-table>
        </div>
        <div class="table-footer">
            <el-pagination background layout="total, sizes, prev, pager, next" :total="100"></el-pagination>
        </div>
    </div>
</template>

<script>
import api from "../../../api/index";
export default {
    name: 'UserSet',
    components: {

    },
    data: () => {
        return {
            userSetData: []
        }
    },
    methods: {
        handleSelectionChange() {

        },
        deleteRow() {

        }
    },
    mounted: async function () {
        let res = await api.UserManage.getUserSetList({ token: '123' });
        if (res&&res.msg === "OK") {
            this.userSetData = res.data;
            console.log("???",this.userSetData);
        }
    },
}
</script>

<style>
</style>
